import foodModel from "../models/foodModel.js";
import adminModel from "../models/adminModel.js";
import fs from "fs";

// ✅ Add food item
const addFood = async (req, res) => {
  try {
    const image_filename = `${req.file.filename}`;
    const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: image_filename,
      adminId: req.user._id,
    });

    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error adding food" });
  }
};

// ✅ List food for logged-in admin
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({ adminId: req.user._id });
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching food list" });
  }
};

// ✅ Remove food by logged-in admin
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findOne({
      _id: req.body._id,
      adminId: req.user._id,
    });
    if (!food) return res.json({ success: false, message: "Not authorized" });

    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body._id);

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error removing food" });
  }
};

// ✅ Group food items by merchants (with admin name)
const getFoodByMerchants = async (req, res) => {
  try {
    const merchants = await foodModel.aggregate([
      {
        $group: {
          _id: "$adminId",
          items: { $push: "$$ROOT" },
        },
      },
    ]);

    const response = await Promise.all(
      merchants.map(async (merchant) => {
        const admin = await adminModel.findById(merchant._id).select("name");
        return {
          adminId: merchant._id,
          adminName: admin?.name || "Unknown Merchant",
          foods: merchant.items,
        };
      })
    );

    res.json({ success: true, merchants: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching merchants" });
  }
};
// ✅ Get all food items with merchant name (for customers)
const getAllFoodWithMerchant = async (req, res) => {
  try {
    const foods = await foodModel.find().populate('adminId', 'name'); // populate merchant name

    // Attach admin name manually for frontend
    const result = foods.map(food => ({
      ...food._doc,
      adminName: food.adminId.name || "Unknown Merchant"
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error in getAllFoodWithMerchant:", error);
    res.status(500).json({ success: false, message: "Failed to fetch food list" });
  }
};

// ✅ Get food items for a specific merchant
const getFoodByAdmin = async (req, res) => {
  try {
    const adminId = req.params.adminId;

    // Check if valid ObjectId
    if (!adminId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid admin ID" });
    }

    const foods = await foodModel.find({ adminId });
    const admin = await adminModel.findById(adminId).select("name");

    res.status(200).json({
      success: true,
      adminName: admin?.name || "Merchant",
      foods,
    });
  } catch (err) {
    console.error("Error in getFoodByAdmin:", err);
    res.status(500).json({ success: false, message: "Error fetching shop" });
  }
};

// ✅ Get all merchant IDs who have food items
const getMerchantsWithFood = async (req, res) => {
  try {
    const merchantIds = await foodModel.distinct("adminId");
    res.status(200).json({ merchantIds });
  } catch (err) {
    console.error("Error in getMerchantsWithFood:", err);
    res.status(500).json({ error: "Failed to fetch merchant list" });
  }
};
// ✅ Search foods and merchants
const searchFoodAndMerchants = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) return res.status(400).json({ success: false, message: "Query missing" });

    const foodMatches = await FoodModel.find({
      name: { $regex: query, $options: "i" }
    }).populate("adminId", "name");

    const merchantMatches = await Admin.find({
      name: { $regex: query, $options: "i" }
    });

    res.status(200).json({
      success: true,
      foodMatches,
      merchantMatches
    });
  } catch (error) {
    console.error("Error in search:", error);
    res.status(500).json({ success: false, message: "Search failed" });
  }
};



export {
  addFood,
  listFood,
  removeFood,
  getFoodByMerchants,
  getFoodByAdmin,
  getMerchantsWithFood,
  getAllFoodWithMerchant,
  searchFoodAndMerchants
};
