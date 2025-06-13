import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
  quantity: { type: Number, required: true },
}, { _id: false });

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  items: { type: [itemSchema], required: true },
  amount: { type: Number, required: true },
  address: { type: addressSchema, required: true },
  status: { type: String, default: "Placed" },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "admin_user", required: true },
  payment: { type: Boolean, default: false }
}, {
  timestamps: true
});

const OrderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default OrderModel;
