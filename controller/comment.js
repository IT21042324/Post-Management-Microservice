const commentModel = require("../model/comment");
const postModel = require("../model/post");

const createComment = async (req, res) => {
  const { postID, userID } = req.body;

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

module.exports = {
  createComment,
};
