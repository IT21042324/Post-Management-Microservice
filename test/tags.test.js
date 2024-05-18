const request = require("supertest");
const { app, startServer } = require("../server.js");
const mongoose = require("mongoose");

let server;
const testPostId = "6617b5fb673289a38b7b7a05";

beforeAll(async () => {
  server = await startServer();
});

describe("Test GET /posts/6617b5fb673289a38b7b7a04/tags", () => {
  it("should return all tags for a valid post ID", async () => {
    // Setup: Create a test post with existing tags in the database (implementation details omitted)
    // Replace with actual ID

    const response = await request(app).get(`/api/posts/${testPostId}/tags`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // Ensure an array is returned
  });

  it("should return 404 for an invalid post ID", async () => {
    const invalidPostId = "6617b5fb673289a38b7b7a0443";

    const response = await request(app).get(`/api/posts/${invalidPostId}/tags`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("error"); // Expect error message
  });
});

describe("Test PATCH api/posts/6617b5fb673289a38b7b7a04/tags", () => {
  it("should update post tags with valid data", async () => {
    // Setup: Create a test post with existing tags (implementation details omitted)
    const updatedTags = ["tag1", "tag2"];

    const response = await request(app)
      .put(`/api/posts/${testPostId}/tags`)
      .send({ tags: updatedTags });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tags"); // Expect updated tags in response
    expect(response.body.tags).toEqual(updatedTags); // Verify tags match
  });

  it("should return 400 for invalid request body", async () => {
    const invalidData = { name: "invalid" }; // Not an array of tags

    const response = await request(app)
      .put(`/api/posts/${testPostId}/tags`)
      .send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error"); // Expect error message
  });
});

describe("Test DELETE /posts/6617b5fb673289a38b7b7a04/tags/:tagIndex", () => {
  it("should delete a tag with a valid post ID and tag index", async () => {
    // Setup: Create a test post with multiple tags (implementation details omitted)
    const validTagIndex = 1; // Assuming tags are indexed (adjust based on implementation)

    const response = await request(app).delete(
      `/api/posts/${testPostId}/tags/${validTagIndex}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tags"); // Expect updated tags in response
    // Additional assertions can be made based on expected tag removal
  });

  it("should return 400 for an invalid tag index", async () => {
    const invalidTagIndex = -1; // Negative index

    const response = await request(app).delete(
      `/api/posts/${testPostId}/tags/${invalidTagIndex}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error"); // Expect error message
  });
});

describe("Test PATCH /posts/6617b5fb673289a38b7b7a04/status", () => {
  it("should update post status with valid data", async () => {
    const newStatus = "true"; // Or 'false' depending on your status definition

    const response = await request(app)
      .put(`/api/posts/${testPostId}/status`)
      .send({ postStatus: newStatus });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("postStatus");
    expect(response.body.postStatus).toBe(newStatus);
  });

  it("should return 400 for an invalid status value", async () => {
    const invalidStatus = "invalid"; // Not 'true' or 'false'

    const response = await request(app)
      .put(`/api/posts/${testPostId}/status`)
      .send({ postStatus: invalidStatus });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error"); // Expect error message
  });
});

describe("Test GET /posts/status/true", () => {
  it("should return posts with a valid status (true or false)", async () => {
    const validStatus = "true"; // Or 'false' depending on your status definition

    const response = await request(app).get(`/api/posts/status/${validStatus}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array); // Ensure an array of posts is returned
    // Additional assertions can be made about the response data, like checking post properties
  });

  it("should return 400 for an invalid status value", async () => {
    const invalidStatus = "invalid"; // Not 'true' or 'false'

    const response = await request(app).get(
      `/api/posts/status/${invalidStatus}`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message"); // Expect error message
  });

  it("should return 404 for no posts with that status", async () => {
    const unlikelyStatus = "unlikely"; // A status unlikely to exist

    const response = await request(app).get(
      `/api/posts/status/${unlikelyStatus}`
    );

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message"); // Expect error message about no posts found
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
