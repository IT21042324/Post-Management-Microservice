const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    postTitle: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    postType: {
      type: String,
      required: true,
    },

    //Single user can have only a single emoji to represent his likes. so it has to be consisitently updated for a post
    likes: {
      type: Array,
      default: [
        {
          userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          emoji: {
            type: Boolean,
            default: 0,
          },
        },
      ],
    },

    // Single user can have many comments for a single post. or they can update the exisiting post if they want.
    comments: {
      type: Array,
      default: [
        {
          userID: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          comment: {
            type: String,
          },
        },
      ],
    },

    postStatus: {
      type: Boolean,
      default: 1,
    }, //To ensure a that a post is still active. incase a post is blocked due to coommunity guidelines, then we set this post to 0.

    reasonForBlocking: {
      type: String,
      default: "",
    }, // if the post is blocked, then we need to have a reason for it.

    visibility: {
      type: String, //private or public
      default: 1, // 1 for public and 0 for private
    }, // this is to make sure that the post is archived and not visible to the public.

    visibilityMembersList: {
      type: Array,
      default: [], // if the visibility is set to private, then we need to have a list of members who can view the post.
    },

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    tags: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

//Arani
// postStatus
// tags

// Kaushani
// visibility and visibilitly members list

//Yohan
// likes management and emojis

//Reezan
//Comments
