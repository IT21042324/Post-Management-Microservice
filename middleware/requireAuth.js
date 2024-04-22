const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const requireAuth = async (req, res, next) => {
  const backendUrl = process.env.BACKENDURI;
  const secret = process.env.SECRET;

  // const backendUrl = "http://localhost:3000";

  const { authorization } = req.headers;

  // Check if authorization token is provided in the request header
  if (!authorization) {
    console.log({ error: "Authorization token not found" });
    return res.status(401).json({ error: "Authorization token not found" });
  }

  console.log("authorization", authorization);

  // Extract the token from the authorization header
  const token = authorization.split(" ")[1];

  console.log(token);

  try {
    // Verify the token using the secret key
    const { id } = jwt.verify(token, "YARK@2000");

    console.log(id);

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
