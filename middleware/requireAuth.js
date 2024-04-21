const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const backendUrl = process.env.BACKENDURI;

  // const backendUrl = "http://localhost:3000";

  const { authorization } = req.headers;

  // Check if authorization token is provided in the request header
  if (!authorization) {
    console.log({ error: "Authorization token not found" });
    return res.status(401).json({ error: "Authorization token not found" });
  }

  // Extract the token from the authorization header
  const token = authorization.split(" ")[1];

  try {
    // Verify the token using the secret key
    const { id } = jwt.verify(token, process.env.SECRET);

    // Retrieve user data from API using the id and role from the token
    const { data } = await axios.get(`${backendUrl}/api/users/${id}`);

    // Attach user data to the request object
    req.user = data;

    // Call next middleware function
    next();
  } catch (error) {
    console.log({ error: "Unauthorized Request" });
    res.status(401).json({ error: "Unauthorized Request" });
  }
};

module.exports = requireAuth;
