const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server"); // replace with your server file path
const should = chai.should();

chai.use(chaiHttp);

describe("Testing Post Routes", () => {
  describe("/POST post", () => {
    it("it should create a post", (done) => {
      let post = {
        postTitle: "Test Post",
        description: "This is a test post",
        postType: "text",
      };
      chai
        .request(server)
        .post("/api/posts")
        .send(post)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("postTitle").eql(post.postTitle);
          // Add other assertions as necessary
          done();
        });
    });

    it("it should not create a post without postTitle field", (done) => {
      let post = {
        description: "This is a test post",
        postType: "text",
        // postTitle field is missing
      };
      chai
        .request(server)
        .post("/api/posts")
        .send(post)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("postTitle is required");
          done();
        });
    });

    it("it should not create a post with invalid postType field", (done) => {
      let post = {
        postTitle: "Test Post",
        description: "This is a test post",
        postType: "invalid", // invalid postType
      };
      chai
        .request(server)
        .post("/api/posts")
        .send(post)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("postType is invalid");
          done();
        });
    });
  });
});
