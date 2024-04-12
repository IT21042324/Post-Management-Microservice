const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

//Creating an express app
const app = express();

// Basic rate limit configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Configure middleware functions
app.use(express.json({ limit: "10mb" })); // Adjusted limit
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(helmet()); // Set security-related HTTP headers
app.use(limiter); // Apply rate limiting

// Get port number and database URI from environment variables
const PORT = process.env.PORT || 3000; // Default port to 3000 if not specified
const URI = process.env.URI;

// Connect to MongoDB database and start server
mongoose
  .connect(URI)
  .then(() => {
    console.log("Connection to MongoDB successful");
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const likeRouter = require("./routes/like");

// Set up routes for handling API endpoints
app.use("/api/posts", postRouter);

// Extra routes
app.use("/api/users", userRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack for debugging
  res.status(500).send("Something broke!"); // Send generic error message to client
});

module.exports = app;
