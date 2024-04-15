const request = require("supertest");
const { app, startServer } = require("../server.js");
const { default: mongoose } = require("mongoose");

let server;

beforeAll(async () => {
  server = await startServer(); // Start the server before all tests
});

describe("Visibility Endpoints", () => {
  // Update post visibility to public
  test("PATCH /api/posts/:id/visibility should update post visibility to public and return 200 status code", async () => {
    const response = await request(app)
      .patch(`/api/posts/6617b5fb673289a38b7b7a05/visibility`)
      .send({ visibility: "public" });

    expect(response.statusCode).toBe(200);
    expect(response.body.visibility).toBe("public");
  });

  // Update post visibility to private with visibility members list
  test("PATCH /api/posts/:id/visibility should update post visibility to private with visibility members list and return 200 status code", async () => {
    const response = await request(app)
      .patch(`/api/posts/6617b5fb673289a38b7b7a05/visibility`)
      .send({
        visibility: "private",
        visibilityMembersList: ["66158127a72308411e9c1e71"],
      }); // Replace with actual user IDs

    expect(response.statusCode).toBe(200);
    expect(response.body.visibility).toBe("private");
    expect(response.body.visibilityMembersList).toEqual([
      "66158127a72308411e9c1e71",
    ]);
  });

  // Update visibility members list for a post
  test("PATCH /api/posts/:id/visibilityList should update visibility members list for a post and return 200 status code", async () => {
    const response = await request(app)
      .patch(`/api/posts/6617b5fb673289a38b7b7a05/visibilityList`)
      .send({
        visibilityMembersList: [
          "66158127a72308411e9c1e71",
          "66158155a72308411e9c1e79",
          "66158161a72308411e9c1e7d",
        ],
      }); // Replace with actual user IDs

    expect(response.statusCode).toBe(200);
    expect(response.body.visibilityMembersList).toEqual([
      "66158127a72308411e9c1e71",
      "66158155a72308411e9c1e79",
      "66158161a72308411e9c1e7d",
    ]);
  });

  // Clear visibility members list for a post
  test("PATCH /api/posts/:id/visibilityList/clear should clear visibility members list for a post and return 200 status code", async () => {
    const response = await request(app).patch(
      `/api/posts/6617b5fb673289a38b7b7a05/visibilityList/clear`
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.visibilityMembersList).toEqual([]);
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
