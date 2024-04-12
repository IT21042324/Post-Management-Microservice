const request = require("supertest");
const app = require("../server"); // Import app

let postId;
let postedBy = "661580fea72308411e9c1e6d";

describe("POST /api/posts", () => {
  it("should create a new post and return 200 status code", async () => {
    const res = await request(app).post("/api/posts").send({
      postTitle: "Test Post",
      description: "This is a test post",
      postType: "Text",
      postedBy,
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body.postTitle).toEqual("Test Post");
    expect(res.body.description).toEqual("This is a test post");
    expect(res.body.postType).toEqual("Text");
    expect(res.body.postedBy).toEqual(postedBy);

    postId = res.body._id;
  });

  it("should return 400 status code when postType is invalid", async () => {
    const res = await request(app).post("/api/posts").send({
      postTitle: "Test Post",
      description: "This is a test post",
      postType: "InvalidType",
    });
    expect(res.statusCode).toEqual(400);
  });

  // Test cases for getPostById
  describe("GET /api/posts/:id", () => {
    it("should return a post and return 200 status code", async () => {
      const res = await request(app).get(`/api/posts/${postId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(postId);
    });
  });

  // Test cases for updatePostById
  describe("PATCH /api/posts/:id", () => {
    it("should update a post and return 200 status code", async () => {
      const res = await request(app).patch(`/api/posts/${postId}`).send({
        postTitle: "Updated Test Post",
        description: "This is an updated test post",
        postType: "Image",
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body.postTitle).toEqual("Updated Test Post");
      expect(res.body.description).toEqual("This is an updated test post");
      expect(res.body.postType).toEqual("Image");
    });

    it("should return 400 status code when postType is invalid", async () => {
      const res = await request(app).patch(`/api/posts/${postId}`).send({
        postTitle: "Test Post",
        description: "This is a test post",
        postType: "InvalidType",
      });
      expect(res.statusCode).toEqual(400);
    });
  });

  // Test cases for deletePostById
  describe("DELETE /api/posts/:id", () => {
    it("should delete a post and return 200 status code", async () => {
      const res = await request(app).delete(`/api/posts/${postId}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body._id).toEqual(postId);
    });
  });
});
