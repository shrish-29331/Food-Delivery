import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
const adminRouter = express.Router();
adminRouter.post("/register", registerAdmin);
adminRouter.post("/login", loginAdmin);
adminRouter.get("/admin-only-stuff", authMiddleware, (req, res) => {
  res.send("This is protected admin data.");
});
export default adminRouter;
