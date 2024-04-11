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

const createMultipleComments = async (req, res) => {
  const comments = req.body;

  try {
    const newComments = await Promise.all(
      comments.map(async (element) => {
        const newComment = await commentModel.create(element);

        await postModel.findByIdAndUpdate(
          element.postID,
          { $push: { comments: newComment._id } },
          { new: true }
        );

        return newComment;
      })
    );

    res.json(newComments);
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
  createMultipleComments,
};
