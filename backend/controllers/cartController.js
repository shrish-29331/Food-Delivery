import userModel from "../models/userModel.js";

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const itemId = req.body.itemId;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "itemId is required" });
        }

        let userData = await userModel.findById(req.user._id);
        let cartData = userData.cartData || {};

        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(req.user._id, { cartData });
        res.json({ success: true, message: "Added To Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const itemId = req.body.itemId;
        if (!itemId) {
            return res.status(400).json({ success: false, message: "itemId is required" });
        }

        const userData = await userModel.findById(req.user._id);
        let cartData = userData.cartData || {};

        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1;
            if (cartData[itemId] === 0) {
                delete cartData[itemId]; // ✅ remove zero quantity items
            }
        }

        await userModel.findByIdAndUpdate(req.user._id, { cartData });
        res.json({ success: true, message: "Removed from Cart" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Get cart
const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.user._id);
        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addToCart, removeFromCart, getCart };
