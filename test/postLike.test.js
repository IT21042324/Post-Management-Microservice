const request = require("supertest");
const { app, startServer } = require("../server.js");
const mongoose = require("mongoose");

let server;
const userId = "661580fea72308411e9c1e6d"
const postId = "6617b5fb673289a38b7b7a04"

beforeAll(async () => {
  server = await startServer(); 
});

describe("Test addEmoji endpoint", () => {
  it("should add emoji to a post", async () => {
    const response = await request(app)
      .patch(`/api/posts/reactions/add/${postId}`)
      .send({ userId: userId, emoji: "👍" });
    expect(response.status).toBe(200);
  });
});

describe("Test getTotalReactions endpoint", () => {
  it("should get total reactions for a post", async () => {
    const response = await request(app).get(
      `/api/posts/reactions/total/${postId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.totalReactions).toBeDefined();
  });
});

describe("Test getEmojiCounts endpoint", () => {
  it("should get emoji counts for a post", async () => {
    const response = await request(app).get(
      `/api/posts/reactions/count/${postId}`
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Test removeEmoji endpoint", () => {
  it("should remove emoji for a post", async () => {
    const response = await request(app)
      .patch(`/api/posts/reactions/delete/${postId}`)
      .send({ userId: userId });
    expect(response.status).toBe(200);
  });
});

describe("Test getAllReactions endpoint", () => {
  it("should get all reactions", async () => {
    const response = await request(app).get(`/api/posts/reactions/getall`);
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

afterAll((done) => {
  if (server) {
    server.close(async () => {
      await mongoose.connection.close();
      console.log("Server closed successfully");
      done(); 
    });
  }
});
