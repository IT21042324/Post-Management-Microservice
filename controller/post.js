const postModel = require("../model/post");

const createPost = async (req, res) => {
  const post = req.body;
  post.postType =
    post?.postType?.charAt(0)?.toUpperCase() +
    post?.postType?.slice(1)?.toLowerCase()?.trim();

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
      fieldsToUpdate?.postType?.charAt(0)?.toUpperCase() +
      fieldsToUpdate?.postType?.slice(1)?.toLowerCase()?.trim();

    if (!validPostTypes.includes(fieldsToUpdate.postType)) {
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

//get all tags
const getPostTags = async (req, res) => {
  try {
    const post = await postModel.findById(req.params.id).select("tags");
    res.json(post.tags);
  } catch (err) {
    res.send(err.message);
  }
};

//update post tags
const updatePostTags = async (req, res) => {
  const postId = req.params.id;
  const updatedTags = req.body.tags;

  try {
    const post = await postModel.findById(postId);
    post.tags = updatedTags;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

//delete tag
const deleteTag = async (req, res) => {
  const postId = req.params.id;
  const tagIndex = req.params.tagIndex;

  try {
    const post = await postModel.findById(postId);
    post.tags.splice(tagIndex, 1);
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.send(err.message);
  }
};

//update post status
const updatePostStatus = async (req, res) => {
  const { postStatus, reasonForBlocking } = req.body;
  const postId = req.params.id;

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { postStatus, reasonForBlocking },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get posts by status
const getPostsByStatus = async (req, res) => {
  const { status } = req.params;

  if (status !== "true" && status !== "false") {
    return res
      .status(400)
      .json({ message: "Invalid status value (true or false expected)" });
  }

  try {
    const posts = await postModel.find({ postStatus: status });

    if (!posts.length) {
      return res
        .status(404)
        .json({ message: "No posts found with that status" });
    }
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Likes Management

const addEmoji = async (req, res) => {
  try {
    const { userId, emoji } = req.body;
    const postId = req.params.postId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const existingReaction = post.likes.find((like) => like.userID === userId);

    if (existingReaction) {
      existingReaction.emoji = emoji;
    } else {
      post.likes.push({ userID: userId, emoji: emoji });
    }

    await post.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const changeEmoji = async (req, res) => {
//   try {
//     const { userId, emoji } = req.body;
//     const postId = req.params.postId;

//     
//     const post = await postModel.findById(postId);

//     if (!post) {
//       return res.status(404).json({ error: "Post not found" });
//     }

//     
//     const existingReactionIndex = post.likes.findIndex(like => like.userID === userId);

//     if (existingReactionIndex !== -1) {
//       
//       post.likes[existingReactionIndex].emoji = emoji;
//     } else {
//       
//       post.likes.push({ userID: userId, emoji: emoji });
//     }

//     
//     await post.save();

//     res.sendStatus(200);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

const getEmojiCounts = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const emojiCounts = {};

    // Iterate over the likes
    for (let like of post.likes) {
      if (emojiCounts[like.emoji]) {
        emojiCounts[like.emoji]++;
      } else {
        emojiCounts[like.emoji] = 1;
      }
    }

    const emojiCountsArray = Object.keys(emojiCounts).map((emoji) => ({
      _id: emoji,
      count: emojiCounts[emoji],
    }));

    res.json(
      emojiCountsArray.length ? emojiCountsArray : [{ _id: null, count: 0 }]
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalReactions = async (req, res) => {
  try {
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const totalReactions = post.likes.length;

    res.json({ totalReactions: totalReactions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllReactions = async (req, res) => {
  try {
    const allReactions = await postModel.find({}, 'likes');

    const flattenedReactions = allReactions.reduce((acc, cur) => {
      acc.push(...cur.likes.map(like => ({ postId: cur._id.toString(), userId: like.userID, emoji: like.emoji })));
      return acc;
    }, []);

    res.json(flattenedReactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeEmoji = async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.postId;

    const post = await postModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const likeIndex = post.likes.findIndex(like => like.userID === userId);

    if (likeIndex === -1) {
      return res.status(404).json({ error: "User reaction not found for this post" });
    }

    post.likes.splice(likeIndex, 1);

    await post.save();

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  updatePostStatus,
  getAllPostIDs,
  updateVisibility,
  updateVisibilityMembersList,
  clearVisibilityMembersList,
  getPostTags,
  updatePostTags,
  getPostsByStatus,
  deleteTag,
  getTotalReactions,
  addEmoji,
  getEmojiCounts,
  getAllReactions,
  removeEmoji
};
