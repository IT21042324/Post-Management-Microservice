const mongoose = require("mongoose");
const Schema = mongoose.Schema;
 const validEmojis = ['👍', '❤️', '😄', '😯', '😢'];

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
      enum: [
        "Text",
        "Image",
        "Video",
        "Document",
        "Article",
        "Event",
        "Poll",
        "Posting",
        "Job",
      ],
      required: true,
    },

    //Single user can have only a single emoji to represent his likes. so it has to be consisitently updated for a post
    likes: {
      type: [
        {
          userID: {
            type: String,
            ref: "User",
          },
          emoji: {
            type: String,
            enum: validEmojis,
          },
        },
      ],
    },

    // Single user can have many comments for a single post. or they can update the exisiting post if they want.
    comments: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Comment",
        },
      ],
      default: [],
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
      type: String,
      enum: ["public", "private"],
      default: "public", // Default visibility is public
    }, // this is to make sure that the post is archived and not visible to the public.

    visibilityMembersList: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ], // if the visibility is set to private, then we need to have a list of members who can view the post.

    postedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tags: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

/* -------------------------------------------------------------------------- */
/*                              Work Distribution                             */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Arani --------------------------------- */
/* ------------------------------- postStatus ------------------------------- */
/* ---------------------------------- tags ---------------------------------- */

/* -------------------------------- Kaushani -------------------------------- */
/* ----------------- Visibility And Visibilitly Members List ---------------- */

/* ---------------------------------- Yohan --------------------------------- */
/* ----------------------- Likes Management And Emojis ---------------------- */

/* --------------------------------- Reezan --------------------------------- */
/* -------------------------------- Comments -------------------------------- */
/* ------------------------------- Search Posts ------------------------------ */
