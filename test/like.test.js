const request = require("supertest");

// const postId = "66159a338ed99899cf2d93c2";

const { app, startServer } = require("../server.js");
const { default: mongoose } = require("mongoose");

let server;

beforeAll(async () => {
  server = await startServer(); // Start the server before all tests
});

describe("Test addEmoji endpoint", () => {
  it("should add emoji to a post", async () => {
    const response = await request(app)
      .post("/api/likes/66159a338ed99899cf2d93c2/reactions/add")
      .send({ userId: "661580fea72308411e9c1e6d", emoji: "👍" });
    expect(response.status).toBe(200);
  });

  it("should select emoji if already reacted", async () => {
    const response = await request(app)
      .put("/api/likes/66159a338ed99899cf2d93c2/reactions")
      .send({ userId: "661580fea72308411e9c1e6d", emoji: "👍" });
    expect(response.status).toBe(200);
  });
});

describe("Test getTotalReactions endpoint", () => {
  it("should get total reactions for a post", async () => {
    const response = await request(app).get(
      "/api/likes/66159a338ed99899cf2d93c2/reactions/total"
    );
    expect(response.status).toBe(200);
    expect(response.body.totalReactions).toBeDefined();
  });
});

describe("Test getEmojiCounts endpoint", () => {
  it("should get emoji counts for a post", async () => {
    const response = await request(app).get(
      "/api/likes/66159a338ed99899cf2d93c2/reactions/count"
    );
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Test selectEmoji endpoint", () => {
  it("should select emoji for a post", async () => {
    const response = await request(app)
      .put("/api/likes/66159a338ed99899cf2d93c2/reactions")
      .send({ userId: "661580fea72308411e9c1e6d", emoji: "❤️" });
    expect(response.status).toBe(200);
  });
});

describe("Test removeEmoji endpoint", () => {
  it("should remove emoji for a post", async () => {
    const response = await request(app)
      .delete("/api/likes/66159a338ed99899cf2d93c2/reactions")
      .send({ userId: "661580fea72308411e9c1e6d" });
    expect(response.status).toBe(200);
  });
});

describe("Test getAllReactions endpoint", () => {
  it("should get all reactions", async () => {
    const response = await request(app).get("/api/likes/");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
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
