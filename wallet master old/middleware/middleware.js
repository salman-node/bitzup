import dotenv from "dotenv"

dotenv.config();

export const verify = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Check if the authorization header is present
    if (!authorization) {
      throw new Error("You are not authorized");
    }
    // Check if the authorization header starts with "Bearer "
    if (!authorization.startsWith("Bearer ")) {
      throw new Error("You are not authorized");
    }

    // Extract the token from the authorization header
    const token = authorization.split(" ")[1];

    if (process.env.JWT_TOKEN !== token) {
      throw new Error("You are not authorized");
    }

    // Call the next middleware
    next();
  } catch (err) {
    res.status(200).json({ success: "0", message: err.message });
  }
};