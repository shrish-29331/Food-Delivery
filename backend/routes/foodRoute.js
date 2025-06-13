import express from "express";
import multer from "multer";
import path from "path";
import FoodModel from "../models/foodModel.js";
import Admin from "../models/adminModel.js";
import { addFood, listFood, removeFood, getFoodByMerchants } from "../controllers/foodController.js";
import authMiddleware from "../middleware/auth.js";
import { getAllFoodWithMerchant } from "../controllers/foodController.js";

const router = express.Router();

// 📦 Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Folder where images are saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// 🔐 Protected routes (for admin)
router.post("/add", authMiddleware, upload.single("image"), addFood);
router.get("/list", authMiddleware, listFood);
router.post("/remove", authMiddleware, removeFood);

// ✅ Public route to list all food items with merchant info
router.get("/public", getAllFoodWithMerchant);
 // or any route your frontend hits

// ✅ Public: All foods grouped by merchant
router.get("/by-merchants", getFoodByMerchants);

// ✅ Public: Get food items by specific merchant + name
router.get("/by-admin/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const foods = await FoodModel.find({ adminId });

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      adminName: admin.name,
      foods,
    });
  } catch (err) {
    console.error("Error in /by-admin:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch foods for this admin",
    });
  }
});

// ✅ Public: Get unique merchant IDs who have uploaded food
router.get("/merchants-with-food", async (req, res) => {
  try {
    const merchantIds = await FoodModel.distinct("adminId");
    res.status(200).json({ merchantIds });
  } catch (err) {
    console.error("Error in /merchants-with-food:", err);
    res.status(500).json({ error: "Failed to fetch merchant list" });
  }
});
import { searchFoodAndMerchants } from "../controllers/foodController.js";

router.get("/search", searchFoodAndMerchants);

export default router;
