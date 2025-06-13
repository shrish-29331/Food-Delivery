import express from "express";
import authMiddleware from "../middleware/auth.js";
import { 
  placeOrder, 
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus 
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// 🧑‍🍳 Customer places order
orderRouter.post("/place", authMiddleware, placeOrder);

// ✅ Verify payment (e.g., after Razorpay or Stripe hook)
orderRouter.post("/verify", verifyOrder);

// 🧑‍🍳 Get only logged-in user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// 👑 Admin-only: List all orders for their own restaurant
orderRouter.get("/list", authMiddleware, listOrders);

// 👑 Admin-only: Update order status (e.g., Placed → Out for Delivery)
orderRouter.post("/status", authMiddleware, updateStatus);

export default orderRouter;
