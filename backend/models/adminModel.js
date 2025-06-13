import mongoose from "mongoose";

const AdminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
});

const adminModel = mongoose.models.admin_user || mongoose.model("admin_user", AdminUserSchema);

export default adminModel;
