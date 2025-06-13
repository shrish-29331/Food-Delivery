import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ success: false, message: "Admin not found" });
    }

    req.user = admin;
    console.log("Authenticated Admin:", req.user._id); // ✅ Debug line
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    res.status(403).json({ success: false, message: "Invalid or expired token." });
  }
};

export default authMiddleware;
