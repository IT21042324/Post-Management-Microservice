const request = require("supertest");
const { app, startServer } = require("../server.js");
const { default: mongoose } = require("mongoose");

let postId;
let userId = "661580fea72308411e9c1e6d";

// let commentId = "6617bd2695ab8d366df04e38";
// let comment_desc =
//   "Great post! I found your experiences in data science very insightful.";

let server;
let token;

beforeAll(async () => {
  server = await startServer(); // Start the server before all tests

  const response = await request(app).post("/api/users/login").send({
    userName: "user2@example.com",
    password: "password2",
  });

  token = "Bearer " + response.body.token;
});

//Create a new post for the rest of the new operations
describe("POST /api/posts", () => {
  it("should create a new post and return 200 status code", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", token)
      .send({
        postTitle: "Test Post",
        description: "This is a test post",
        postType: "Text",
        postedBy: userId,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.postTitle).toEqual("Test Post");
    expect(res.body.description).toEqual("This is a test post");
    expect(res.body.postType).toEqual("Text");

    postId = res.body._id;
  });
});

// // Create a sample user for the rest of the test cases
// describe("POST /api/users", () => {
//   it("should create a new user and return 200 status code", async () => {
//     const res = await request(app).post("/api/users").send({
//       username: "testUser",
//       email: "test_user@gmail.com",
//       password: "testPassword",
//     });
//     expect(res.statusCode).toEqual(200);
//     expect(res.body.username).toEqual("testUser");
//     expect(res.body.email).toEqual("test_user@gmail.com");

//     userId = res.body._id;
//   });
// });

// Create a comment for the rest of the test cases..
describe("POST /api/comments", () => {
  it("should create a new comment and return 200 status code", async () => {
    const res = await request(app)
      .post("/api/comments")
      .set("Authorization", token)
      .send({
        comment: "Test Comment",
        postID: postId,
        userID: userId,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.comment).toEqual("Test Comment");
    expect(res.body.postID).toEqual(postId.toString());
    expect(res.body.userID).toEqual(userId.toString());

    commentId = res.body._id;
    comment_desc = res.body.comment;
    postId = res.body.postID;
  });
});

// Test cases for fetchAllCommentsForPost
describe("GET /api/posts/:id/comments", () => {
  it("should return all comments for a post and return 200 status code", async () => {
    const res = await request(app)
      .get(`/api/posts/${postId}/comments`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body.postID).toEqual(postId.toString());
  });
});

// Test cases for postCommmentForPost
describe("PATCH /api/posts/:id/comments", () => {
  it("should add a comment to a post and return 200 status code", async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}/comments`)
      .set("Authorization", token)
      .send({ commentID: commentId });
    expect(res.statusCode).toEqual(200);
    expect(res.body.comments).toContainEqual(commentId);
  });
});

// Test cases for getSinglePostWithDetails
describe("GET /api/posts/details/:id", () => {
  it("should return a single post with details and return 200 status code", async () => {
    const res = await request(app)
      .get(`/api/posts/details/${postId}`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(postId.toString());

    expect(res.body.comments[0]._id).toEqual(commentId);
    expect(res.body.comments[0].userID).toEqual(userId);
    expect(res.body.comments[0].postID).toEqual(postId);
    expect(res.body.comments[0].comment).toEqual(comment_desc);
  });
});

// Test cases for removeCommentFromPost
describe("PATCH /api/posts/:id/comments/delete", () => {
  it("should remove a comment from a post and return 200 status code", async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}/comments/delete`)
      .set("Authorization", token)
      .send({ commentID: commentId });
    expect(res.statusCode).toEqual(200);
    expect(res.body.comments).not.toContainEqual(commentId);
  });
});

// Test cases for searchPost
describe("GET /api/posts/search", () => {
  it("should return posts that match the search query and return 200 status code", async () => {
    const res = await request(app)
      .get("/api/posts/search")
      .set("Authorization", token)
      .send({ searchQuery: "Test" });
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]?.postTitle || res.body?.postTitle).toEqual("Test Post");

    expect(res.body[0]?.description || res.body?.description).toEqual(
      "This is a test post"
    );
    expect(res.body[0]?.postType || res.body?.postType).toEqual("Text");
  });
});

//To delete the test case at the end
describe("DELETE /api/posts/:id", () => {
  it("should delete a post and return 200 status code", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(postId);
  });
});

//To delete the created comment at the end
describe("DELETE /api/comments/:id", () => {
  it("should delete a comment and return 200 status code", async () => {
    const res = await request(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", token);
    expect(res.statusCode).toEqual(200);
    expect(res.body._id).toEqual(commentId);
  });
});

afterAll((done) => {
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log("Server closed successfully");
      done(); // Ensure Jest waits for the server to close before finishing
    });
  }
});
// //To delete the created user at the end
// describe("DELETE /api/users/:id", () => {
//   it("should delete a user and return 200 status code", async () => {
//     const res = await request(app).delete(`/api/users/${userId}`);
//     expect(res.statusCode).toEqual(200);
//     expect(res.body._id).toEqual(userId);
//   });
// });
