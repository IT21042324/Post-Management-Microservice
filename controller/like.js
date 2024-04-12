const Like = require("../model/like");
const mongoose = require('mongoose');

const addEmoji = async (req, res) => {
  try {
    const { userId, emoji } = req.body;
    const postId = req.params.postId;
    const existingReaction = await Like.findOne({ userID: userId, postID: postId });
    if (existingReaction) {
      await selectEmoji(req, res);
    } else {
      await Like.create({ userID: userId, postID: postId, emoji: emoji });
      res.sendStatus(200);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalReactions = async (req, res) => {
  try {
    const postId = req.params.postId;
    const totalReactions = await Like.countDocuments({ postID: postId });
    res.json({ totalReactions: totalReactions || 0 }); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmojiCounts = async (req, res) => {
  try {
    const postId = new mongoose.Types.ObjectId(req.params.postId); 
    const emojiCounts = await Like.aggregate([
      { $match: { postID: postId } }, 
      { $group: { _id: '$emoji', count: { $sum: 1 } } },
    ]);
    res.json(emojiCounts.length ? emojiCounts : [{ _id: null, count: 0 }]); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const selectEmoji = async (req, res) => {
  try {
    const { userId, emoji } = req.body;
    const postId = req.params.postId;
    await Like.findOneAndUpdate(
      { userID: userId, postID: postId },
      { userID: userId, postID: postId, emoji: emoji },
      { upsert: true }
    );
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeEmoji = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;
    await Like.findOneAndDelete({ userID: userId, postID: postId });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReactions = async (req, res) => {
  try {
    const allReactions = await Like.find().populate('userID').populate('postID');
    res.json(allReactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addEmoji,
  getTotalReactions,
  getEmojiCounts,
  selectEmoji,
  removeEmoji,
  getAllReactions
};
