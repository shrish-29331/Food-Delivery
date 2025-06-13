import mongoose from "mongoose";

// Define the food schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
 category: {
  type: String,
  required: true,
  enum: ["Food", "Grocery"]
},

  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "admin_user", required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create the food model
const FoodModel = mongoose.models.Food || mongoose.model("Food", foodSchema);

export default FoodModel;
