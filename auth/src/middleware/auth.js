import User from "../models/user.js";
import { VerifyToken } from "../helpers/helper.js";

export const Authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Check for Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("Authentication failed - No token provided", {
        ip: req.ip,
        url: req.originalUrl,
      });
      return res.status(401).json({ success: false, msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    //  Verify JWT
    let decoded;
    try {
      decoded = VerifyToken(token);
    } catch (err) {
      console.warn("Authentication failed - Invalid or expired token", {
        ip: req.ip,
        url: req.originalUrl,
        error: err.message,
      });
      return res.status(401).json({ success: false, msg: "Invalid or expired token" });
    }

    // Fetch user from DB
    const user = await User.findById(decoded._id).select("-Password -RefreshToken");
    if (!user) {
      console.warn("Authentication failed - User not found", {
        ip: req.ip,
        url: req.originalUrl,
        userId: decoded._id,
      });
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    // Attach user to request for downstream routes
    req.user = user;

    console.info("Authentication successful", {
      userId: user._id,
      ip: req.ip,
      url: req.originalUrl,
    });

    next();
  } catch (error) {
    console.error("Authentication error:", {
      message: error.message,
      stack: error.stack,
      ip: req.ip,
      url: req.originalUrl,
    });
    console.log("Authentication failed due to server error");
    return res.status(500).json({
      success: false,
      msg: "Authentication failed due to server error",
    });
  }
};
