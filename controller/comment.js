const commentModel = require("../model/comment");
const postModel = require("../model/post");

const createComment = async (req, res) => {
  const { postID } = req.body;

  try {
    const newComment = await commentModel.create(req.body);
    const updatedPost = await postModel.findByIdAndUpdate(
      postID,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

const deleteComment = async (req, res) => {
  const commentID = req.params.id;
  const { postID } = req.body;

  try {
    await commentModel.findByIdAndDelete(commentID);
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

module.exports = {
  createComment,
  deleteComment,
};
