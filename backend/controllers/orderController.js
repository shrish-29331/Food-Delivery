import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Place Order — With Stripe Session
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    const items = req.body.items;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    const adminId = items[0].adminId; // ⚠️ Assumes single-merchant cart

    const newOrder = new orderModel({
      userId: req.user.id,
      items,
      amount: req.body.amount,
      address: req.body.address,
      adminId,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100 * 80, // Assuming 80x markup for INR
      },
      quantity: item.quantity,
    }));

    // Add delivery charges
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100 * 80,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder.id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder.id}`,
    });

    console.log("Stripe session created:", session.url);

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Error placing order" });
  }
};

// ✅ Verify Order Status
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order canceled" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Error verifying payment" });
  }
};

// ✅ Logged-in User’s Orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("User order fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// ✅ Admin’s Orders Only
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ adminId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Admin order fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching admin orders" });
  }
};

// ✅ Admin Status Update
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findOne({ _id: orderId, adminId: req.user.id });
    if (!order) {
      return res.status(403).json({ success: false, message: "Not authorized to update this order" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error("Order status update error:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
