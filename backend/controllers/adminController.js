import adminModel from "../models/adminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await adminModel.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({ name, email, password: hashed });
    await newAdmin.save();

    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: newAdmin.name, email: newAdmin.email } });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Registration failed" });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await adminModel.findOne({ email });
    if (!admin) return res.json({ success: false, message: "Email not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    res.json({ success: true, token, user: { name: admin.name, email: admin.email } });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: "Login failed" });
  }
};
