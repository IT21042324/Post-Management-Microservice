const commentModel = require("../model/comment");
const postModel = require("../model/post");

const createComment = async (req, res) => {
  const { postID } = req.body;

  try {
    const newComment = await commentModel.create(req.body);
    await postModel.findByIdAndUpdate(
      postID,
      { $push: { comments: newComment._id } },
      { new: true }
    );
    res.json(newComment);
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

//The idea here is when delete comment function is called from the comment MS then this function will be called.
const deleteComment = async (req, res) => {
  const commentID = req.params.id;
  const { postID } = req.body;

  try {
    const deletedComment = await commentModel.findByIdAndDelete(commentID);
    await postModel.findByIdAndUpdate(
      postID,
      { $pull: { comments: commentID } },
      { new: true }
    );

    res.json(deletedComment);
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  createComment,
  deleteComment,
  createMultipleComments,
};
